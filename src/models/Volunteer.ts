import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteer extends Document {
    userId?: mongoose.Types.ObjectId;

    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;

    // Skills and Experience
    skills: string[];
    experience: string;
    previousVolunteer: boolean;

    // Availability
    availableDates: string[];
    hoursPerWeek: string;

    // Location
    location: {
        address: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
        formattedAddress?: string;
    };

    // Documents (Cloudinary URLs)
    documents?: {
        certification?: string;
        backgroundCheck?: string;
    };

    // Additional
    motivation: string;
    references?: string;

    // Application Status
    status: "pending" | "approved" | "rejected";
    confirmationToken?: string;
    isConfirmed: boolean;
    confirmedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: String,
            required: true,
        },
        previousVolunteer: {
            type: Boolean,
            default: false,
        },
        availableDates: {
            type: [String],
            default: [],
        },
        hoursPerWeek: {
            type: String,
            required: true,
        },
        location: {
            address: {
                type: String,
                required: true,
            },
            coordinates: {
                lat: Number,
                lng: Number,
            },
            formattedAddress: String,
        },
        documents: {
            certification: String,
            backgroundCheck: String,
        },
        motivation: {
            type: String,
            required: true,
        },
        references: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        confirmationToken: {
            type: String,
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        confirmedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
VolunteerSchema.index({ email: 1 });
VolunteerSchema.index({ status: 1 });
VolunteerSchema.index({ confirmationToken: 1 });

export default mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
