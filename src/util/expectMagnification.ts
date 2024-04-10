import { OBJLENS_OPTIONS, ObjlensOption } from "@/type/options";

const isObjlensOption = (str: string): str is ObjlensOption => {
  return OBJLENS_OPTIONS.some((item) => item === str);
};

export const expectMagnification = (
  name: string
): ObjlensOption | undefined => {
  const regex =
    /((?<=[ｘxX×✕])(40|100|200|400|500))|((40|100|200|400|500)(?=[ｘxX×✕倍]))/;
  const match = regex.exec(name)?.[0];
  const objlens = `x${match}`;
  if (isObjlensOption(objlens)) return objlens;
  return undefined;
};
