import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
}

export default function SEO({
  title,
  description,
  image = '/og-image.jpg',
  url = 'https://www.evcart.com',
  type = 'website',
}: SEOProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: title,
    description: description,
    url: url,
    image: image,
  }

  return (
    <Head>
      {/* 基础 SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="电动观光车，景区观光车，酒店电瓶车，EV Cart" />
      <meta name="author" content="EV Cart 集团" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:site_name" content="EV Cart 集团" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
