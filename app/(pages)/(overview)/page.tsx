import Image from "next/image";
import Link from "next/link";
import backgroundImage from "@/public/images/background_neko.jpg";

export default function Home() {

  return (
    <main>
      <div className="hero min-h-screen">
        <Image
          alt="catimage"
          src={backgroundImage}
          placeholder="blur"
          quality={100}
          fill={true}
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-100">
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-bold">DoSuRu</h1>
            <p className="text-md mb-4">
              「TODOアプリ」と「どうする？」がひとつになった、<br />
              軽やかで直感的なカンバンボード。
            </p>
            <p className="text-md mb-4">
              やるべきことを整理して、頭の中をすっきり！<br />
              ドラッグ＆ドロップで、タスクをスイスイ移動。<br />
              気持ちまで軽くなるかも？
              DoSuRuで、あなたの毎日をちょっとだけ効率よく、ちょっとだけ楽しく。
            </p>
            <p className="text-lg mb-8">さて、次は何を「どうする？」</p>
            <Link href="/dosuru" className="btn btn-secondary btn-lg">Get Started</Link>
          </div>
        </div>
      </div>
    </main >
  );
}
