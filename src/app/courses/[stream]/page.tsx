import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseStreamContent from '@/components/courses/CourseStreamContent';
import { STREAMS, STREAM_SLUGS, getStreamMeta } from '@/data/streams';
import type { StreamSlug } from '@/data/courses';

export function generateStaticParams() {
  return STREAM_SLUGS.map((stream) => ({ stream }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { stream: string } }): Metadata {
  const meta = getStreamMeta(params.stream);
  if (!meta) return {};
  return {
    title: meta.seoTitle,
    description: meta.seoDescription,
    alternates: { canonical: `/courses/${meta.slug}` },
    openGraph: {
      type: 'website',
      url: `https://abhaglobaleducare.com/courses/${meta.slug}`,
      title: meta.seoTitle,
      description: meta.seoDescription,
      siteName: 'ABHA Global Educare',
      locale: 'en_IN',
    },
  };
}

export default function CourseStreamPage({ params }: { params: { stream: string } }) {
  const meta = STREAMS.find((s) => s.slug === params.stream);
  if (!meta) notFound();
  return <CourseStreamContent stream={params.stream as StreamSlug} />;
}
