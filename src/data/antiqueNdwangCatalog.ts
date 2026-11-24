export type GarmentSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type AntiqueNdwangProduct = {
  id: string
  name: string
  shortName: string
  description: string
  frontImage: string
  backImage: string
  gsm: number
  fabric: string
  fit: string
  sizes: GarmentSize[]
  price: number
  currency: 'ZAR'
  frontDetail: string
  backDetail: string
}

export const antiqueNdwangCatalog: AntiqueNdwangProduct[] = [
  {
    id: 'an-nd-mascot-boxy-tee',
    name: '“AN ND” Mascot Boxy Tee',
    shortName: 'AN ND Mascot',
    description: 'A heavyweight boxy tee with the house character at the chest and a graphic statement across the back.',
    frontImage: '/garments/an-nd-mascot-front.svg',
    backImage: '/garments/an-nd-mascot-back.svg',
    gsm: 280,
    fabric: '100% heavyweight cotton',
    fit: 'Drop-shoulder boxy fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 950,
    currency: 'ZAR',
    frontDetail: 'Minimal white character emblem on front chest',
    backDetail: 'Stacked AN ND block typography with character graphic',
  },
  {
    id: 'standing-out-layered-tee',
    name: 'Don’t Be Afraid of Standing Out Layered Tee',
    shortName: 'Standing Out',
    description: 'A confident layered graphic, printed on a substantial cotton body with an easy oversized silhouette.',
    frontImage: '/garments/standing-out-front.svg',
    backImage: '/garments/standing-out-back.svg',
    gsm: 280,
    fabric: '100% heavyweight cotton',
    fit: 'Drop-shoulder boxy fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 1050,
    currency: 'ZAR',
    frontDetail: 'Small white Antique Ndwang chest emblem',
    backDetail: 'White bubble lettering layered with distressed red statement type',
  },
  {
    id: 'oversized-character-back-tee',
    name: 'Oversized Character Back Tee',
    shortName: 'Character Back',
    description: 'Quiet from the front, unmistakable from behind: an oversized character illustration anchors this heavyweight tee.',
    frontImage: '/garments/character-back-front.svg',
    backImage: '/garments/character-back-back.svg',
    gsm: 280,
    fabric: '100% heavyweight cotton',
    fit: 'Drop-shoulder boxy fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 950,
    currency: 'ZAR',
    frontDetail: 'Minimal white character emblem on front chest',
    backDetail: 'Large distressed white character graphic across the back',
  },
  {
    id: 'vertically-stretched-typography-tee',
    name: 'Vertically Stretched Typography Tee',
    shortName: 'Stretched Type',
    description: 'A graphic study in proportion with tall, elongated Antique Ndwang lettering on a relaxed black body.',
    frontImage: '/garments/stretched-type-front.svg',
    backImage: '/garments/stretched-type-back.svg',
    gsm: 280,
    fabric: '100% heavyweight cotton',
    fit: 'Drop-shoulder boxy fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 990,
    currency: 'ZAR',
    frontDetail: 'Minimal white character emblem on front chest',
    backDetail: 'Tall, vertically elongated distressed Antique Ndwang lettering',
  },
]
