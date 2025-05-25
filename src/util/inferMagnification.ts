import { MagnificationOption } from "@/type/imageState";
import { MicroscopeType } from "@/type/options";
import { isSafeMTypeOLPair } from "@/util/judgeMicrosocpeType";

const inferMicroscopeType = (size: {
  height: number;
  width: number;
}): MicroscopeType => {
  if (size.width === 1937 && size.height === 1460) {
    return "inverted";
  }
  return "upright";
};

export const inferMagnification = (
  name: string,
  size: { height: number; width: number }
): MagnificationOption => {
  // ファイル名解析
  const regex =
    /((?<=[ｘxX×✕])(500|400|200|100|40))|((500|400|200|100|40)(?=[ｘxX×✕倍]))/;
  const match = regex.exec(name)?.[0];
  const objLens = `x${match}`;

  // 解像度解析
  const microscopeType = inferMicroscopeType(size);

  const magOption = { microscopeType, objLens };

  if (isSafeMTypeOLPair(magOption)) {
    return magOption;
  }

  // objLensがmicroscopeTypeに合ってなかったらデフォルト値の"x200"を返す
  return { microscopeType, objLens: "x200" };
};
