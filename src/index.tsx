import { ActionPanel, List, Action, open, getApplications } from "@raycast/api";
import { useEffect, useState } from "react";
import { useExec } from "@raycast/utils";
import { showInFinder } from "@raycast/api";
import path from "path";

export default function Command() {
  const [searchContent, setSearchContent] = useState(["", ""]);
  const [files, setFiles] = useState<string[]>([]);

  const { data } = useExec(`mdfind 'tag:${searchContent[0] === "" ? "ZZZZZZ" : searchContent[0]}'`, {
    shell: true,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      let files = data.split(/\r?\n/);
      if (searchContent[1]) {
        const searchTerm = searchContent[1].toLowerCase().replace(/[-_]/g, '');
        files = files.filter((item) =>
          item.toLowerCase().replace(/[-_]/g, '').includes(searchTerm)
        );
      }
      setFiles(files);
    }
  }, [data, searchContent[1]]);

  const updateSearch = (str: string) => {
    const [tag, content] = str.split(" ");
    setSearchContent([tag, content]);
  };

  const formatFileName = (fileName: string) => {
    const baseName = path.basename(fileName);
    const cleanedBaseName = baseName
      .replace(/[-_]/g, ' ')
      .replace(/\.pdf$/, '')
      .replace(/\s+main$/, '');
    const words = cleanedBaseName.split(' ');
    const filteredWords = words.filter((word) => word.length <= 20);
    const formattedName = filteredWords.join(' ').replace(/\s+/g, ' ').trim();
    return formattedName;
  };

  return (
    <List filtering={false} onSearchTextChange={updateSearch}>
      {files.map((item) => (
        <List.Item
          key={item}
          id={item}
          title={`[${searchContent[0]}] ${formatFileName(item)}`}
          actions={
            <ActionPanel>
              <Action title="Open File" onAction={() => open(item)} />
              <Action title="Show in Finder" onAction={() => showInFinder(item)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}