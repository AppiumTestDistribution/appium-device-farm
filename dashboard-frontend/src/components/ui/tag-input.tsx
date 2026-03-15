import { useState } from 'react';
import { TagsInput } from 'react-tag-input-component';

interface iTag {
  tags: string[];
  onSave: (tags: string[]) => void;
}

export const TagInput = ({ tags, onSave }: iTag) => {
  const [_tags, setTags] = useState(tags);
  const [tagsInEdit, setTagsInEdit] = useState('');

  return (
    <div className="flex flex-col w-[100%] items-center gap-2">
      <TagsInput
        value={tags}
        onChange={(newtags) => {
          setTagsInEdit('');
          setTags(newtags);
        }}
        onKeyUp={(e) => {
          if (e.key.toString().length === 1) {
            setTagsInEdit(tagsInEdit + e.key);
          }
        }}
        name="device tags"
        placeHolder="Add tags and press enter"
        classNames={{
          tag: '!bg-gray-700 text-gray-300 text-xs font-medium me-2 rounded',
          input:
            'text-gray-700 h-3 !text-sm text-xs font-medium border-transparent focus:border-transparent focus:ring-0 !w-[100%]',
        }}
      />
      <button
        type="button"
        style={{
          color: 'rgb(255, 194, 0)',
          borderColor: 'rgb(255, 194, 0)',
        }}
        className="px-3 py-2 text-xs font-medium text-center inline-flex items-center rounded-lg border"
        onClick={() => {
          const tagsToSave = [..._tags];
          if (tagsInEdit && tagsInEdit != '' && tagsToSave.indexOf(tagsInEdit) < 0) {
            tagsToSave.push(tagsInEdit);
          }
          onSave(tagsToSave);
        }}
      >
        Save Tags
      </button>
    </div>
  );
};
