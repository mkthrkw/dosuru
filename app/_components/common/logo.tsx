import { Amatic_SC } from 'next/font/google';

/*
import { Zilla_Slab_Highlight } from 'next/font/google';
import { Poiret_One } from 'next/font/google';
import { Lilita_One } from 'next/font/google';
import { Edu_NSW_ACT_Foundation } from 'next/font/google';
import { Bad_Script } from 'next/font/google';


const zillaSlabHightlight = Zilla_Slab_Highlight({
  weight: "700",
  subsets: ["latin"]
});

const poiretOne = Poiret_One({
  weight: "400",
  subsets: ["latin"]
});

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"]
});

const eduNswActFoundation = Edu_NSW_ACT_Foundation({
  weight: "400",
  subsets: ["latin"]
});

const badScript = Bad_Script({
  weight: "400",
  subsets: ["latin"]
});
*/


const amaticSC = Amatic_SC({
  weight: "700",
  subsets: ["latin"]
});

export function Logo() {
  return (
    <span className={amaticSC.className}>
      DoSuRu
    </span>
  );
}