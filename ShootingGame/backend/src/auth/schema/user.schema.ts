import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})
export class User extends Document{
    @Prop()
    username:string

    @Prop()
    name:string

    @Prop()
    password:string

    @Prop({ type: Number })
    totalGames: number;

    @Prop({ type: Number })
    win: number;

    @Prop({ type: Number })
    lose: number;
}

export const userSchema = SchemaFactory.createForClass(User);
