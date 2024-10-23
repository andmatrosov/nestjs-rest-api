import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type CategoriesDocument = HydratedDocument<CategoriesModel>

@Schema({timestamps: true})
export class CategoriesModel {
    @Prop({ type: String, required: true, unique: true })
    name: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(CategoriesModel);