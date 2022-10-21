import { Layout } from '@/components/common';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h1>Whoops, that page is gone.</h1>
        <span className="font-thin text-slate-600">
          Or maybe I broke something😰, anyway...
        </span>
        <div className="mt-32">
          <span className="text-9xl h-96 underline font-black">404</span>
        </div>
      </div>
    </Layout>
  );
}
