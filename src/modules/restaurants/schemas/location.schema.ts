import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Location {
    @Prop({
        type: String,
        enum: ['Point'],
    })
    type: string;

    @Prop({
        type: [Number],
        index: '2dsphere',
    })
    coordinates: number[];

    @Prop({
        type: String,
    })
    formattedAddress: string;

    @Prop({
        type: String,
    })
    city: string;

    @Prop({
        type: String,
    })
    state: string;

    @Prop({
        type: String,
    })
    countryCode: string;

    @Prop({
        type: String,
    })
    zipCode: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
