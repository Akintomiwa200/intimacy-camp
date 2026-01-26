import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import mongoose from "mongoose";
import Participant from "@/src/models/Participant";
import Volunteer from "@/src/models/Volunteer";

// Define models if they don't exist
const defineModels = () => {
  // Participant and Volunteer are imported

  if (!mongoose.models.Sermon) {
    mongoose.model("Sermon", new mongoose.Schema({
      title: String,
      preacher: String,
      date: Date,
      description: String,
      audioUrl: String,
      videoUrl: String,
      thumbnailUrl: String,
      views: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      tags: [String],
      createdAt: { type: Date, default: Date.now }
    }));
  }

  if (!mongoose.models.MediaClip) {
    mongoose.model("MediaClip", new mongoose.Schema({
      title: String,
      type: { type: String, enum: ['video', 'image', 'short'] },
      url: String,
      thumbnailUrl: String,
      duration: Number,
      category: String,
      views: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    }));
  }

  if (!mongoose.models.AudioMessage) {
    mongoose.model("AudioMessage", new mongoose.Schema({
      title: String,
      speaker: String,
      audioUrl: String,
      duration: Number,
      category: String,
      plays: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    }));
  }

  if (!mongoose.models.Testimony) {
    mongoose.model("Testimony", new mongoose.Schema({
      title: String,
      content: String,
      author: String,
      email: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      category: String,
      createdAt: { type: Date, default: Date.now }
    }));
  }
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    defineModels();

    // Get models
    // Participant and Volunteer are imported directly
    const Sermon = mongoose.models.Sermon;
    const MediaClip = mongoose.models.MediaClip;
    const AudioMessage = mongoose.models.AudioMessage;
    const Testimony = mongoose.models.Testimony;

    // Fetch all data in parallel
    const [
      participants,
      volunteers,
      sermons,
      mediaClips,
      audioMessages,
      testimonies
    ] = await Promise.all([
      Participant.find({}).sort({ createdAt: -1 }).lean(),
      Volunteer.find({}).sort({ createdAt: -1 }).lean(),
      Sermon.find({}).sort({ date: -1 }).limit(5).lean(),
      MediaClip.find({}).sort({ createdAt: -1 }).limit(10).lean(),
      AudioMessage.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Testimony.find({}).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    // Stats for all modules
    const participantsTotal = participants.length;
    const volunteersTotal = volunteers.length;
    const sermonsTotal = await Sermon.countDocuments();
    const mediaTotal = await MediaClip.countDocuments();
    const audioTotal = await AudioMessage.countDocuments();

    // Get aggregate data
    const [sermonViews, mediaViews, audioPlays] = await Promise.all([
      Sermon.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      MediaClip.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      AudioMessage.aggregate([{ $group: { _id: null, total: { $sum: "$plays" } } }])
    ]);

    const stats = {
      participants: {
        total: participantsTotal,
        newToday: await Participant.countDocuments({
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
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
        videos: await MediaClip.countDocuments({ type: 'video' }),
        images: await MediaClip.countDocuments({ type: 'image' }),
        totalViews: mediaViews[0]?.total || 0
      },
      audio: {
        total: audioTotal,
        totalPlays: audioPlays[0]?.total || 0
      },
      testimonies: {
        total: await Testimony.countDocuments(),
        pending: await Testimony.countDocuments({ status: 'pending' }),
        approved: await Testimony.countDocuments({ status: 'approved' })
      },
      // FIX: overview moved INSIDE stats object
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
        stats, // Now includes overview inside
        recent: {
          participants: participants.slice(0, 5),
          volunteers: volunteers.slice(0, 5),
          sermons,
          mediaClips,
          audioMessages,
          testimonies: testimonies.slice(0, 5)
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
    'MediaClip', 'AudioMessage', 'Testimony'
  ];

  const activities: any[] = [];

  for (const modelName of models) {
    const model = mongoose.models[modelName];
    if (model) {
      const recent = await model.find({})
        .sort({ createdAt: -1 })
        .limit(2)
        .lean();

      recent.forEach((item: any) => {
        // FIX: Use _id instead of id
        let title = item.title || item.name;
        if (!title && item.firstName && item.lastName) {
          title = `${item.firstName} ${item.lastName}`;
        }

        activities.push({
          _id: item._id.toString(), // CHANGED FROM id TO _id
          type: modelName.toLowerCase(),
          action: modelName === 'Testimony' ? 'submitted' : 'added',
          title: title || `New ${modelName}`,
          timestamp: item.createdAt,
        });
      });
    }
  }

  return activities.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);
}

async function getMediaByCategory() {
  const MediaClip = mongoose.models.MediaClip;
  if (!MediaClip) return [];

  const result = await MediaClip.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalViews: { $sum: "$views" }
      }
    },
    { $sort: { totalViews: -1 } }
  ]);

  // Ensure all categories have a name
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