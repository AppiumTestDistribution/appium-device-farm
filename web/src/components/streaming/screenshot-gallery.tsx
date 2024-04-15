import { DeleteOutline, FileDownload } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { saveAs } from 'file-saver';

export function ScreenshotGallery({
  screenshots,
  onDeleteScreenshot,
}: {
  screenshots: string[];
  onDeleteScreenshot: (index: number) => void;
}) {
  return (
    <div className="screenshot-gallery ">
      {screenshots.map((s, i) => (
        <div key={i} className="screenshot-gallery-thumbnail">
          <img src={`data:image/png;base64,${s}`} />
          <div className="action-menus">
            <IconButton onClick={() => onDeleteScreenshot(i)}>
              <DeleteOutline />
            </IconButton>
            <IconButton onClick={() => saveAs(`data:image/png;base64,${s}`, `screenshot-${i}.jpg`)}>
              <FileDownload />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
