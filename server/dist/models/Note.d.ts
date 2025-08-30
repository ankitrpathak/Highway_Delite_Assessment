import mongoose, { Document } from 'mongoose';
export interface INote extends Document {
    title: string;
    content: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Note: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote, {}, {}> & INote & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Note;
//# sourceMappingURL=Note.d.ts.map