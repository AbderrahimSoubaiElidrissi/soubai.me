import Link from "next/link";
import ReactMarkdown from "react-markdown/with-html";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import Layout from "components/Layout";
import Image from "components/Image";
import SEO from "components/Seo";
import { getPostBySlug, getPostsSlugs } from "utils/posts";
import Bio from "components/Bio";
import useDarkMode from 'use-dark-mode';

const CodeBlock = ({ language, value }) => {
  return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
};

const MarkdownImage = ({ alt, src }) => (
  <Image
    alt={alt}
    src={`/${src}`}
    webpSrc={`/${src}?webp`}
    previewSrc={`/${src}?lqip-colors`}
    className="w-full"
  />
);

export default function Post({ post, frontmatter, nextPost, previousPost }) {

  const darkMode = useDarkMode(false);

  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        socialImage={frontmatter.socialImage}
        description={frontmatter.description || post.excerpt}
      />

      <article>
        <header className="">

          <Image
            alt={frontmatter.title}
            src={`/${frontmatter.socialImage}`}
            webpSrc={`/${frontmatter.socialImage}?webp`}
            previewSrc={`/${frontmatter.socialImage}?lqip-colors`}
            className="mb-8 w-full"
          />
          <div className="mb-6 ">
            <h1 className="text-2xl font-bold text-orange-600 leading-none font-display">
              {frontmatter.title}
            </h1>
            <p className="text-sm">{frontmatter.date}</p></div>
        </header>
        <ReactMarkdown
          className={"prose"}
          escapeHtml={false}
          source={post.content}
          renderers={{ code: CodeBlock, image: MarkdownImage }}
        />
        <hr className="mt-4" />
        <footer>
          <Bio className="mt-8 mb-16" />
        </footer>
      </article>
      <nav className="flex flex-wrap justify-between mb-10">
        {previousPost ? (
          <Link href={"/post/[slug]"} as={`/post/${previousPost.slug}`}>
            <a className="text-lg font-bold">
              ← {previousPost.frontmatter.title}
            </a>
          </Link>
        ) : (
            <div />
          )}
        {nextPost ? (
          <Link href={"/post/[slug]"} as={`/post/${nextPost.slug}`}>
            <a className="text-lg font-bold">{nextPost.frontmatter.title} →</a>
          </Link>
        ) : (
            <div />
          )}
      </nav>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = getPostBySlug(slug);

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
}
