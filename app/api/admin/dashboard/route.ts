import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import mongoose from "mongoose";
import Participant from "@/src/models/Participant";
import Volunteer from "@/src/models/Volunteer";
import Sermon from "@/src/models/Sermon";
import Media from "@/src/models/Media";
import Testimony from "@/src/models/Testimony";
import AudioMessage from "@/src/models/AudioMessage";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get URL parameters for pagination
    const url = new URL(req.url);
    const participantsLimit = parseInt(url.searchParams.get('participantsLimit') || '50');
    const volunteersLimit = parseInt(url.searchParams.get('volunteersLimit') || '50');
    const sermonsLimit = parseInt(url.searchParams.get('sermonsLimit') || '10');
    const testimoniesLimit = parseInt(url.searchParams.get('testimoniesLimit') || '20');

    // Fetch all data in parallel with proper sorting
    const [
      participants,
      volunteers,
      sermons,
      mediaClips,
      audioMessages,
      testimonies
    ] = await Promise.all([
      Participant.find({})
        .sort({ createdAt: -1 }) // Newest first
        .limit(participantsLimit)
        .lean(),
      Volunteer.find({})
        .sort({ createdAt: -1 }) // Newest first
        .limit(volunteersLimit)
        .lean(),
      Sermon.find({})
        .sort({ date: -1, createdAt: -1 }) // Newest sermons first
        .limit(sermonsLimit)
        .lean(),
      Media.find({})
        .sort({ createdAt: -1 }) // Newest media first
        .limit(50)
        .lean(),
      AudioMessage.find({})
        .sort({ createdAt: -1 }) // Newest audio first
        .limit(50)
        .lean(),
      Testimony.find({})
        .sort({ createdAt: -1 }) // Newest testimonies first
        .limit(testimoniesLimit)
        .lean()
    ]);

    // Stats for all modules
    const participantsTotal = await Participant.countDocuments();
    const volunteersTotal = await Volunteer.countDocuments();
    const sermonsTotal = await Sermon.countDocuments();
    const mediaTotal = await Media.countDocuments();
    const audioTotal = await AudioMessage.countDocuments();

    // Get aggregate data
    const [sermonViews, mediaViews, audioPlays] = await Promise.all([
      Sermon.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      Media.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      AudioMessage.aggregate([{ $group: { _id: null, total: { $sum: "$plays" } } }])
    ]);

    // Get today's date for new participants
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      participants: {
        total: participantsTotal,
        newToday: await Participant.countDocuments({
          createdAt: { $gte: today }
        }),
        growth: await getGrowthRate(Participant, 'participants')
      },
      volunteers: {
        total: volunteersTotal,
        active: await Volunteer.countDocuments({ status: 'active' }),
        growth: await getGrowthRate(Volunteer, 'volunteers')
      },
      sermons: {
        total: sermonsTotal,
        totalViews: sermonViews[0]?.total || 0,
        recent: sermons.length
      },
      media: {
        total: mediaTotal,
        videos: await Media.countDocuments({ type: 'video' }),
        images: await Media.countDocuments({ type: 'image' }),
        totalViews: mediaViews[0]?.total || 0
      },
      audio: {
        total: audioTotal,
        totalPlays: audioPlays[0]?.total || 0
      },
      testimonies: {
        total: await Testimony.countDocuments(),
        pending: await Testimony.countDocuments({ isApproved: false }),
        approved: await Testimony.countDocuments({ isApproved: true })
      },
      overview: {
        totalPeople: participantsTotal + volunteersTotal,
        totalContent: sermonsTotal + mediaTotal + audioTotal,
        totalEngagement: (sermonViews[0]?.total || 0) + (mediaViews[0]?.total || 0) + (audioPlays[0]?.total || 0)
      }
    };

    // Recent activities (combined from all modules)
    const recentActivities = await getRecentActivities();

    // Registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrends = await Participant.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top viewed sermons
    const topSermons = await Sermon.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title preacher views date downloads')
      .lean();

    // Testimony statistics by category
    const testimonyStats = await Testimony.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          }
        }
      }
    ]);

    const [mediaByCategory, audioByCategory] = await Promise.all([
      getMediaByCategory(),
      getAudioByCategory()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recent: {
          participants, // Now returns ALL participants (limited by participantsLimit)
          volunteers, // Now returns ALL volunteers (limited by volunteersLimit)
          sermons,
          mediaClips,
          audioMessages,
          testimonies // Now returns ALL testimonies (limited by testimoniesLimit)
        },
        analytics: {
          registrationTrends,
          topSermons,
          testimonyStats,
          mediaByCategory,
          audioByCategory
        },
        recentActivities
      }
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        error: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper functions
async function getGrowthRate(model: any, type: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const weekAgo = new Date(startOfToday);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [todayCount, yesterdayCount, lastWeekCount] = await Promise.all([
    model.countDocuments({
      createdAt: {
        $gte: startOfToday
      }
    }),
    model.countDocuments({
      createdAt: {
        $gte: startOfYesterday,
        $lt: startOfToday
      }
    }),
    model.countDocuments({
      createdAt: { $gte: weekAgo }
    })
  ]);

  const dailyGrowth = yesterdayCount > 0
    ? ((todayCount - yesterdayCount) / yesterdayCount) * 100
    : todayCount > 0 ? 100 : 0;

  const weeklyAvgToday = todayCount / 7;
  const weeklyAvgLastWeek = lastWeekCount / 7;
  const weeklyGrowth = weeklyAvgLastWeek > 0
    ? ((weeklyAvgToday - weeklyAvgLastWeek) / weeklyAvgLastWeek) * 100
    : weeklyAvgToday > 0 ? 100 : 0;

  return {
    daily: parseFloat(dailyGrowth.toFixed(2)),
    weekly: parseFloat(weeklyGrowth.toFixed(2))
  };
}

async function getRecentActivities() {
  const models = [
    'Participant', 'Volunteer', 'Sermon',
    'Media', 'AudioMessage', 'Testimony'
  ];

  const activities: any[] = [];

  for (const modelName of models) {
    const model = mongoose.models[modelName];
    if (model) {
      const recent = await model.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      recent.forEach((item: any) => {
        let title = item.title || item.name;
        if (!title && item.firstName && item.lastName) {
          title = `${item.firstName} ${item.lastName}`;
        }

        activities.push({
          _id: item._id.toString(),
          type: modelName.toLowerCase(),
          action: modelName === 'Testimony' ? 'submitted' : 
                  modelName === 'Sermon' ? 'published' : 'added',
          title: title || `New ${modelName}`,
          timestamp: item.createdAt,
        });
      });
    }
  }

  return activities.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 15);
}

async function getMediaByCategory() {
  if (!Media) return [];

  const result = await Media.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalViews: { $sum: "$views" }
      }
    },
    { $sort: { totalViews: -1 } }
  ]);

  return result.map(item => ({
    _id: item._id || 'Uncategorized',
    count: item.count,
    totalViews: item.totalViews
  }));
}

async function getAudioByCategory() {
  const AudioMessage = mongoose.models.AudioMessage;
  if (!AudioMessage) return [];

  const result = await AudioMessage.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalPlays: { $sum: "$plays" }
      }
    },
    { $sort: { totalPlays: -1 } }
  ]);

  return result.map(item => ({
    _id: item._id || 'Uncategorized',
    count: item.count,
    totalPlays: item.totalPlays
  }));
}