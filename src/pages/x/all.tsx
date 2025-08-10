import { GetStaticProps } from "next";
import { createSiteGarden } from "../../lib/garden";

interface AllPagesProps {
  files: Array<{
    path: string;
    name: string;
    title: string;
  }>;
}

export default function AllPages({ files }: AllPagesProps) {
  return (
    <article>
      <h1>All Markdown Files</h1>
      <p>This page lists all markdown files in the directory.</p>

      <ul>
        {files.map((file) => (
          <li key={file.path}>
            <a href={`/${file.name}`}>{file.title}</a>
            <small style={{ marginLeft: "1rem", opacity: 0.7 }}>
              ({file.path})
            </small>
          </li>
        ))}
      </ul>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const garden = await createSiteGarden();

  const files = Object.keys(garden.graph.nodes)
    .filter((name: string) => name.indexOf("#") < 0)
    .map((name: string) => ({
      path: name,
      name: name,
      title: name,
    }));

  return {
    props: {
      files,
    },
    revalidate: 60,
  };
};
