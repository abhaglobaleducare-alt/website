import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoursesProviders from '@/components/courses/CoursesProviders';

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CoursesProviders>
        <main id="main-content">{children}</main>
      </CoursesProviders>
      <Footer />
    </>
  );
}
