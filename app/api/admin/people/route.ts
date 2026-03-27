import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

// Define schemas based on your second example
const participantSchema = {
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true, maxlength: 500 },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  maritalStatus: { type: String, required: true, enum: ['single', 'engaged', 'married'] },
  isLeader: { type: String, required: true, enum: ['yes', 'no'] },
  ministry: {
    type: String,
    required: function (this: any) {
      return this.isLeader === 'yes';
    }
  },
  customMinistry: {
    type: String,
    required: function (this: any) {
      return this.isLeader === 'yes' && this.ministry === 'other';
    }
  },
  type: { type: String, default: 'participant', enum: ['participant', 'volunteer'] },
  registrationCode: { type: String, required: true, unique: true },
  isConfirmed: { type: Boolean, default: true },
  emailSent: { type: Boolean, default: false },
  checkInStatus: { type: Boolean, default: false },
  checkInTime: { type: Date },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'pending'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

const volunteerSchema = {
  ...participantSchema,
  departments: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length > 0 && v.length <= 2;
      },
      message: 'Please select 1-2 departments'
    }
  },
  type: { type: String, default: 'volunteer' },
};

// Get models with caching
let Participant: any;
let Volunteer: any;

async function getModels() {
  await connectToDatabase();

  if (!Participant) {
    const participantSchemaObj = new mongoose.Schema(participantSchema);
    participantSchemaObj.index({ email: 1 }, { unique: true });
    participantSchemaObj.index({ registrationCode: 1 }, { unique: true });
    participantSchemaObj.index({ createdAt: 1 });
    participantSchemaObj.index({ isConfirmed: 1 });
    participantSchemaObj.index({ checkInStatus: 1 });
    participantSchemaObj.index({ type: 1 });
    participantSchemaObj.index({ status: 1 });
    Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchemaObj);
  }

  if (!Volunteer) {
    const volunteerSchemaObj = new mongoose.Schema(volunteerSchema);
    volunteerSchemaObj.index({ email: 1 }, { unique: true });
    volunteerSchemaObj.index({ registrationCode: 1 }, { unique: true });
    volunteerSchemaObj.index({ createdAt: 1 });
    volunteerSchemaObj.index({ isConfirmed: 1 });
    volunteerSchemaObj.index({ checkInStatus: 1 });
    volunteerSchemaObj.index({ type: 1 });
    volunteerSchemaObj.index({ status: 1 });
    Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchemaObj);
  }

  return { Participant, Volunteer };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { Participant, Volunteer } = await getModels();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '200'); // Increased default limit
    const skip = (page - 1) * limit;

    // Build query for people listing
    const query: any = {};
    
    // Get filter parameters
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const isConfirmed = searchParams.get('confirmed');
    const isCheckedIn = searchParams.get('checkedIn');
    const status = searchParams.get('status');

    // Apply type filter for listing
    if (type && type !== 'all' && type !== 'staff') {
      query.type = type;
    }

    // Apply status filter for listing
    if (status && status !== 'all') {
      query.status = status;
    }

    // Apply confirmation filter for listing
    if (isConfirmed && isConfirmed !== 'all') {
      query.isConfirmed = isConfirmed === 'true';
    }

    // Apply check-in filter for listing
    if (isCheckedIn && isCheckedIn !== 'all') {
      query.checkInStatus = isCheckedIn === 'true';
    }

    // Search functionality for listing
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationCode: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get people with pagination
    let people = [];
    let total = 0;

    if (type === 'participant') {
      // Only fetch from participants
      people = await Participant.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean();
      total = await Participant.countDocuments(query);
    } 
    else if (type === 'volunteer') {
      // Only fetch from volunteers
      people = await Volunteer.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean();
      total = await Volunteer.countDocuments(query);
    } 
    else if (type === 'staff') {
      // Fetch staff (leaders) from both collections
      const staffQuery = { ...query, isLeader: 'yes' };
      const staffParticipants = await Participant.find(staffQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const staffVolunteers = await Volunteer.find(staffQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      people = [...staffParticipants, ...staffVolunteers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      
      total = await Participant.countDocuments(staffQuery) + 
              await Volunteer.countDocuments(staffQuery);
    } 
    else {
      // Fetch both participants and volunteers (type = 'all' or undefined)
      // Create separate queries without type filter for each collection
      const participantQuery = { ...query };
      const volunteerQuery = { ...query };
      
      // Remove type from queries since we're querying each collection specifically
      delete participantQuery.type;
      delete volunteerQuery.type;
      
      // For participants, ensure we only get participant type
      participantQuery.type = 'participant';
      // For volunteers, ensure we only get volunteer type
      volunteerQuery.type = 'volunteer';
      
      const [participants, volunteers] = await Promise.all([
        Participant.find(participantQuery)
          .sort({ createdAt: -1 }) // Newest first
          .skip(skip)
          .limit(limit)
          .lean(),
        Volunteer.find(volunteerQuery)
          .sort({ createdAt: -1 }) // Newest first
          .skip(skip)
          .limit(limit)
          .lean()
      ]);

      // Combine and sort
      people = [...participants, ...volunteers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      // Get total counts for stats
      const participantCount = await Participant.countDocuments(participantQuery);
      const volunteerCount = await Volunteer.countDocuments(volunteerQuery);
      total = participantCount + volunteerCount;
    }

    // Build stats query
    const statsQuery: any = {};
    
    // Only apply filters that should affect stats
    if (status && status !== 'all') {
      statsQuery.status = status;
    }
    if (isConfirmed && isConfirmed !== 'all') {
      statsQuery.isConfirmed = isConfirmed === 'true';
    }
    if (isCheckedIn && isCheckedIn !== 'all') {
      statsQuery.checkInStatus = isCheckedIn === 'true';
    }
    
    // For search in stats, we need to count both collections
    let statsParticipantQuery: any = { ...statsQuery, type: 'participant' };
    let statsVolunteerQuery: any = { ...statsQuery, type: 'volunteer' };
    
    // Apply search to stats queries if needed
    if (search) {
      const searchOr = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationCode: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
      statsParticipantQuery.$or = searchOr;
      statsVolunteerQuery.$or = searchOr;
    }
    
    // Get stats
    const [
      participantCount,
      volunteerCount,
      confirmedCount,
      pendingCount,
      checkedInCount,
      todayCount,
      staffCount
    ] = await Promise.all([
      Participant.countDocuments(statsParticipantQuery),
      Volunteer.countDocuments(statsVolunteerQuery),
      Participant.countDocuments({ ...statsParticipantQuery, isConfirmed: true }) +
      Volunteer.countDocuments({ ...statsVolunteerQuery, isConfirmed: true }),
      Participant.countDocuments({ ...statsParticipantQuery, isConfirmed: false }) +
      Volunteer.countDocuments({ ...statsVolunteerQuery, isConfirmed: false }),
      Participant.countDocuments({ ...statsParticipantQuery, checkInStatus: true }) +
      Volunteer.countDocuments({ ...statsVolunteerQuery, checkInStatus: true }),
      (async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await Participant.countDocuments({
          ...statsParticipantQuery,
          createdAt: { $gte: today }
        }) + await Volunteer.countDocuments({
          ...statsVolunteerQuery,
          createdAt: { $gte: today }
        });
      })(),
      Participant.countDocuments({ ...statsParticipantQuery, isLeader: 'yes' }) +
      Volunteer.countDocuments({ ...statsVolunteerQuery, isLeader: 'yes' })
    ]);

    // Format response data
    const formattedPeople = people.map((person: any) => ({
      ...person,
      _id: person._id.toString(),
      status: person.status || (person.isConfirmed ? 'active' : 'pending'),
      type: person.type || 'participant',
      checkInStatus: person.checkInStatus || person.attendanceChecked || false,
      checkInTime: person.checkInTime || person.checkedInAt || null,
      createdAt: person.createdAt,
      campDate: person.campDate || null,
      emergencyContact: person.emergencyContact || null,
      medicalInfo: person.medicalInfo || null,
      dietaryRestrictions: person.dietaryRestrictions || [],
      skills: person.skills || [],
      role: person.role || '',
      notes: person.notes || ''
    }));

    return NextResponse.json({
      success: true,
      data: {
        people: formattedPeople,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          total: participantCount + volunteerCount,
          participants: participantCount,
          volunteers: volunteerCount,
          staff: staffCount,
          confirmed: confirmedCount,
          pending: pendingCount,
          checkedIn: checkedInCount,
          todayRegistrations: todayCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { Participant, Volunteer } = await getModels();
    const body = await request.json();

    // Helper function to update in both collections
    const updateInBothCollections = async (filter: any, update: any) => {
      const participantResult = await Participant.updateMany(filter, update);
      const volunteerResult = await Volunteer.updateMany(filter, update);
      return {
        modifiedCount: participantResult.modifiedCount + volunteerResult.modifiedCount
      };
    };

    // Handle bulk confirmations
    if (body.action === 'confirm' && body.ids && Array.isArray(body.ids)) {
      const result = await updateInBothCollections(
        { _id: { $in: body.ids } },
        { $set: { isConfirmed: true, status: 'active', checkInStatus: true, checkInTime: new Date() } }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} people confirmed`
      });
    }

    // Handle bulk check-in
    if (body.action === 'checkin' && body.ids && Array.isArray(body.ids)) {
      const result = await updateInBothCollections(
        { _id: { $in: body.ids } },
        { $set: { checkInStatus: true, checkInTime: new Date() } }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} people checked in`
      });
    }

    // Handle bulk deletion
    if (body.action === 'delete' && body.ids && Array.isArray(body.ids)) {
      const participantResult = await Participant.deleteMany({ _id: { $in: body.ids } });
      const volunteerResult = await Volunteer.deleteMany({ _id: { $in: body.ids } });
      const deletedCount = participantResult.deletedCount + volunteerResult.deletedCount;

      return NextResponse.json({
        success: true,
        message: `${deletedCount} people deleted`
      });
    }

    // Handle individual update
    if (body.id && body.updates) {
      let updatedPerson;

      // Try to find and update in Participant collection first
      updatedPerson = await Participant.findByIdAndUpdate(
        body.id,
        { $set: body.updates },
        { new: true, runValidators: true }
      );

      // If not found in Participant, try Volunteer
      if (!updatedPerson) {
        updatedPerson = await Volunteer.findByIdAndUpdate(
          body.id,
          { $set: body.updates },
          { new: true, runValidators: true }
        );
      }

      if (!updatedPerson) {
        return NextResponse.json(
          { success: false, error: 'Person not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedPerson,
        message: 'Person updated successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating people:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { Participant, Volunteer } = await getModels();
    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    const participantResult = await Participant.deleteMany({ _id: { $in: body.ids } });
    const volunteerResult = await Volunteer.deleteMany({ _id: { $in: body.ids } });
    const deletedCount = participantResult.deletedCount + volunteerResult.deletedCount;

    return NextResponse.json({
      success: true,
      message: `${deletedCount} people deleted`
    });

  } catch (error) {
    console.error('Error deleting people:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}