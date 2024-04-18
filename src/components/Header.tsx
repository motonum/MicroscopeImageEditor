import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  return (
    <div className="flex justify-between border border-border bg-accent h-10 w-screen flex-grow-0 flex-shrink-0 items-center px-5">
      <div className=" text-slate-500">顕微鏡画像編集屋さん</div>
      <Dialog>
        <DialogTrigger className="hover:underline">使い方</DialogTrigger>
        <DialogContent className="h-[90vh]">
          <ScrollArea className="h-full px-1">
            <div className="mb-4 font-bold">使い方ガイド</div>
            <section>
              <h2 className="mb-4 font-semibold">1. 画像の読み込み</h2>
              <p className="indent-4 mb-2">
                「ファイルを選択」をクリックして選択、もしくは画像ファイルをドラッグ&ドロップすると、画像が読み込まれます。読み込まれた画像は左側のサイドパネルに一覧で表示されます。
              </p>
              <p className="indent-4 mb-2">
                画像の倍率は、読み込まれた画像のファイル名の中にある「○○○倍」や「x○○○」などの文字列を認識して自動で設定されます。
              </p>
              <p>
                （倍率の表記がないときや倍率が正しく反映されてない場合は右側の設定パネルより手動で倍率を切り替えてください。）
              </p>
            </section>
            <Separator className="my-4" />
            <section>
              <h2 className="mb-4 font-semibold">2. スケールバーの編集</h2>

              <p className="indent-4 mb-2">
                左側のサイドパネルにある画像をクリックすると編集する画像が選択され、真ん中のスペースに表示されます。ここでスケールバーの設定をします。
              </p>
              <p className="indent-4 mb-2">
                スケールバーの位置はドラッグで動かす事ができます。また、スケールバーの位置変更は読み込まれているすべての画像に適用されます。
              </p>
              <p className="indent-4 mb-2">
                色/スケールバーの長さ/スケールバーの太さ/文字の大きさ/文字の太さは右側の設定パネルから変更できます。
              </p>
              <p className="indent-4 mb-2">
                色は現在選択している画像に、スケールバーの長さは読み込まれている同倍率の画像すべてに、スケールバーの太さ/文字の大きさ/文字の太さは読み込まれている画像すべてに適用されます。
              </p>
              <p className="indent-4 mb-2">
                これらの設定値はデフォルト値としてブラウザに保存されます。
              </p>
            </section>
            <Separator className="my-4" />
            <section>
              <h2 className="mb-4 font-semibold">3. 画像の保存</h2>
              <p className="indent-4 mb-2">
                スケールバーに任意の設定をしたあと、保存ボタンを押すことで選択中の画像を保存することができます。保存機能はブラウザのダウンロードの機能を利用しているため画像はダウンロードフォルダに保存されます。
              </p>
              <p className="indent-4 mb-2">
                また、左側のサイドパネルのすべて保存をクリックすると、サイドパネルにある画像がすべて保存されます。
              </p>
            </section>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
