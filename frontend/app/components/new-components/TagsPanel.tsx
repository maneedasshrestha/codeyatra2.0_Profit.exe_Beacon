import React from "react";
import TagSelector from "../TagSelector";

interface TagsPanelProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({ tags, setTags }) => (
  <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #f3f4f6" }}>
    <TagSelector selected={tags} onChange={setTags} />
  </div>
);

export default TagsPanel;
