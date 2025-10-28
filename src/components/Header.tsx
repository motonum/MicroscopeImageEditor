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
              <h2 className="mb-4 font-semibold">概要</h2>
              <p className="indent-4 mb-2">
                このツールは顕微鏡画像にスケールバー（縮尺バー）を追加・編集し、編集結果をブラウザからダウンロードできるシンプルな画像編集アプリです。すべてブラウザ内で処理され、画像データは外部に送信されません。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">1. 画像の読み込み</h2>
              <p className="indent-4 mb-2">
                「ファイルを選択」ボタンから画像を選ぶか、画像ファイルをアプリにドラッグ&ドロップしてください。読み込んだ画像は左側のサイドパネルに一覧表示されます。
              </p>
              <p className="indent-4 mb-2">
                サムネイルをクリックすると、中央の編集領域にその画像が表示され、編集対象として選択されます。
              </p>
              <p className="indent-4 mb-2">
                ファイル名に「○○倍」「x○○」「×○○」などの表記が含まれていれば、自動で倍率を推定して設定します。推定がうまくいかない場合は右の設定パネルで手動で倍率を選択してください。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">2. スケールバーの編集</h2>
              <p className="indent-4 mb-2">
                編集領域上のスケールバーはドラッグで位置を変更できます。位置変更は全画像に対して共通（全体に反映）されます。
              </p>
              <p className="indent-4 mb-2">
                右側の設定パネルで次の項目を調整できます: 色、スケールバーの長さ、スケールバーの太さ、文字サイズ、文字の太さ。
              </p>
              <p className="indent-4 mb-2">
                適用範囲のまとめ:
              </p>
              <ul className="list-disc pl-8 mb-2">
                <li>スケールバーの位置: 読み込んでいる全画像に反映されます</li>
                <li>スケールバーの長さ: 同倍率の画像すべてに反映されます</li>
                <li>スケールバーの色: 現在選択中の画像にのみ適用されます</li>
                <li>スケールバーの太さ・文字サイズ・文字の太さ: 読み込んでいる全画像に共通で適用されます</li>
              </ul>
              <p className="indent-4 mb-2">
                プレビューはリアルタイムに更新されます。見た目を確認してから保存してください。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">3. 画像の保存（ダウンロード）</h2>
              <p className="indent-4 mb-2">
                編集が終わったら「保存」ボタンで現在選択中の画像をダウンロードできます。ブラウザの通常のダウンロード機能を使うため、保存先はブラウザの設定に従います（通常はダウンロードフォルダ）。
              </p>
              <p className="indent-4 mb-2">
                サイドパネルの「すべて保存」機能を使うと、一覧にあるすべての画像を順に保存できます（各画像に設定されたスケールバーが反映されます）。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">4. トラブルシューティング</h2>
              <h3 className="font-medium">◯ 倍率が正しく認識されない</h3>
              <p className="indent-4 mb-2">
                ファイル名に倍率表記がない、あるいは表記が特殊な場合は自動推定できません。その場合は右側の設定パネルで手動選択してください。
              </p>
              <h3 className="font-medium">◯ スケールバーの長さが実寸とずれる</h3>
              <p className="indent-4 mb-2">
                まず倍率が正しく設定されているか確認してください。倍率が誤っていると、スケールバーの表示が実寸と一致しません。
              </p>
              <h3 className="font-medium">◯ 保存した画像にスケールバーが反映されない</h3>
              <p className="indent-4 mb-2">
                プレビューで見えている状態がそのままダウンロードされるはずです。反映されていない場合は、画像を再度選択してプレビューを確認し、もう一度保存をお試しください。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">5. プライバシーと注意点</h2>
              <p className="indent-4 mb-2">
                画像ファイルはブラウザ内で処理され、外部サーバーへは送信されません。設定（色・太さなど）はローカルストレージに保存されます。機密性の高い画像を扱う際は保存場所やブラウザの設定にご注意ください。
              </p>
            </section>

            <Separator className="my-4" />

            <section>
              <h2 className="mb-4 font-semibold">6. 小技・ヒント</h2>
              <ul className="list-disc pl-8 mb-2">
                <li>代表画像でスケールバーの長さを決め、同倍率の画像に対して「すべて保存」を使うと効率的です。</li>
                <li>文字が読みづらい場合は色や文字サイズ・文字太さを調整してください。</li>
              </ul>
            </section>

          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
