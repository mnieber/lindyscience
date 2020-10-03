class VideoIFrame {
  parentDivId: any;
  iframe: any;
  isMouseOver: boolean = false;

  constructor(parentDivId: string, iframe: any) {
    this.parentDivId = parentDivId;
    this.iframe = iframe;

    window.addEventListener('blur', (e: any) => {
      if (document.activeElement === this.iframe && this.isMouseOver) {
        setTimeout(this.focusParentDiv, 100);
      }
    });

    iframe.addEventListener('mouseover', this.mouseOver);
    iframe.addEventListener('mouseout', this.mouseOut);
  }

  focusParentDiv = () => {
    const elm = document.getElementById(this.parentDivId);
    if (elm) {
      // Store previous scroll position
      let x = window.scrollX,
        y = window.scrollY;
      elm.focus();
      // Restore previous scroll position
      window.scrollTo(x, y);
    }
  };

  mouseOver = () => {
    this.isMouseOver = true;
  };

  mouseOut = () => {
    this.isMouseOver = false;
  };

  unregister = () => {
    this.iframe.removeEventListener('mouseover', this.mouseOver);
    this.iframe.removeEventListener('mouseout', this.mouseOut);
  };
}

const _videoIFrames: { [id: string]: any } = {};

export function listenToIFrame(parentDivId: string, iframe: any) {
  const videoIFrame = _videoIFrames[parentDivId];
  if (videoIFrame && videoIFrame.iframe !== iframe) {
    videoIFrame.unregister();
    delete _videoIFrames[parentDivId];
  }

  if (!_videoIFrames[parentDivId]) {
    const videoIFrame = new VideoIFrame(parentDivId, iframe);
    _videoIFrames[parentDivId] = videoIFrame;
    videoIFrame.focusParentDiv();
  }
}
