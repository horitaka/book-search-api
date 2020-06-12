const GoogleBooks = require('./GoogleBooks');
const googleBooks = new GoogleBooks();

describe('GoogleBooks', () => {
  it('getIsbnList', () => {
    expect(googleBooks.convertBookInfoListFormat(googleBookInfoList)).toEqual(convertedBookInfoList)
  })
})

const googleBookInfoList = {
  items: [{
    volumeInfo: {
      title: "Java Script",
      authors: [
        "デイビッドフラナガン"
      ],
      publisher: "O'Reilly Japan",
      publishedDate: "2007-08",
      description: "Ajax,Domを網羅した最新版が登場",
      industryIdentifiers: [{
        type: "ISBN_13",
        identifier: "9784873113296"
      },
      {
        type: "ISBN_10",
        identifier: "4873113296"
      }
      ],
      imageLinks: {
        smallThumbnail: "http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail: "http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
    },
  },
  {
    kind: "books#volume",
    id: "ZpyK8u2kndAC",
    etag: "dEMdkIn3ZqE",
    selfLink: "https://www.googleapis.com/books/v1/volumes/ZpyK8u2kndAC",
    volumeInfo: {
      title: "よくわかるJavaScriptの教科書",
      authors: [
        "たにぐちまこと"
      ],
      publisher: "マイナビ出版",
      publishedDate: "2012-03",
      description: "今度こそJavaScriptがわかる! JavaScriptの基本から、jQuery、jQueryMobileまで1冊で。 プログラマでない人でも読みやすいように、やさしい言葉を使いながら、1つひとつ丁寧に説明している本ですので、途中で迷うことなく学習を進めることができます。 また、どの項目も、意味のある、汎用的な作例を使いながら説明しているため、内容が理解しやすく、身につきやすくなっています。 本書では、まずはPart1でプログラミングを始める前の準備をします。JavaScriptを学習する上で重要な「オブジェクト指向とは何か」を、プログラミングから離れて一般的な言葉で解説します。 Part2では、JavaScriptの基本をしっかり学びます。文法の基本から始まり、ファンクションやオブジェクトの作成まで解説しています。小さめの作例を使って、達成までのステップを短くしています。 Part3では、jQueryを使ったプログラミングを学習していきます。jQueryの使い方を初歩から学ぶとともに、ニーズの高い作例を通じて、その書き方を身につけることができます。 Part4では、実践編として、応用的な作例を用意しています。Ajaxを使ったスライドショーの作成、jQuery Mobileを使ったスマートフォンサイト制作、HTML5のAPIの使い方など、旬なトピックを取り入れた、楽しくて実用的な内容を詰め込んでいます。",
      industryIdentifiers: [{
        type: "ISBN_10",
        identifier: "4839941874"
      },
      ],
      maturityRating: "NOT_MATURE",
      allowAnonLogging: true,
      contentVersion: "0.3.2.0.preview.1",
      imageLinks: {
        smallThumbnail: "http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail: "http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
    },
  }, {
    kind: "books#volume",
    id: "m7-jDwAAQBAJ",
    etag: "Tb4qFA2q/3k",
    selfLink: "https://www.googleapis.com/books/v1/volumes/m7-jDwAAQBAJ",
    volumeInfo: {
      title: "仕事がはかどるJavaScript活用術 ─Word/Excelで自動処理して効率アップ（日経BP Next ICT選書）",
      authors: [
        "クジラ飛行机"
      ],
      publisher: "日経BP",
      publishedDate: "2014-09-24",
      description: "いまや、パソコンが当たり前にあるオフィス。そんなオフィスだからこそ、こんな難問がときどき、降りかかってきませんか? 「100個あるExcel請求書から宛名と請求金額を抜き出したい」「100人以上に郵送するWord文書すべてに個別のQRコードを挿入したい」…。そんなの「人海戦術しかないでしょう! 」と思っているアナタ。実は一人で、それもほんの数時間でできてしまうのです。 その秘密は、プログラミング。仕事を片付けるために、簡単なプログラムを組むのです。 プログラミングって難しそうだし、なんとなく高価なソフトが必要なように思えるかもしれませんが、そんなことはありません。まず、Windowsがあれば無料です。そして、ちょっとした仕組みが分かれば、いろいろと応用できます。 本書では、プログラマーとして活躍中のクジラ飛行机氏が厳選したプログラミングのコツを公開します。すぐに使えるサンプルプログラムを特設サイトからダウンロードできます。",
      industryIdentifiers: [{
        type: "OTHER",
        identifier: "PKEY:BT000028489600100101900209"
      }],
      imageLinks: {
        smallThumbnail: "http://books.google.com/books/content?id=m7-jDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail: "http://books.google.com/books/content?id=m7-jDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
    },
  },
  ]
}

const convertedBookInfoList = [{
  imageUrl: 'http://books.google.com/books/content?id=RDqQXFA42-kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  title: 'Java Script',
  authors: ['デイビッドフラナガン'],
  isbn: 9784873113296
}, {
  imageUrl: 'http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  title: 'よくわかるJavaScriptの教科書',
  authors: ['たにぐちまこと'],
  isbn: 4839941874
}, {
  imageUrl: 'http://books.google.com/books/content?id=m7-jDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  title: '仕事がはかどるJavaScript活用術 ─Word/Excelで自動処理して効率アップ（日経BP Next ICT選書）',
  authors: ['クジラ飛行机'],
  isbn: 0,
}]
