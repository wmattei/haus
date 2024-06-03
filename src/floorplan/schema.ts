import { ObjectType } from "./objectType";

export interface Object {
  id: string;
  objectType: ObjectType;
  children: Array<Object>;
  parent?: Object;
}

export type Schema = {
  objects: Array<Object>;
};
