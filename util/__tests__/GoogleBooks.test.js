const GoogleBooks = require('../GoogleBooks');
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
          {
            type: "ISBN_13",
            identifier: "9784839941871"
          }
        ],
        maturityRating: "NOT_MATURE",
        allowAnonLogging: true,
        contentVersion: "0.3.2.0.preview.1",
        imageLinks: {
          smallThumbnail: "http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          thumbnail: "http://books.google.com/books/content?id=ZpyK8u2kndAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
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
    isbn: 9784839941871
  }
]
