export const withCutVideoBvr = compose(
  Ctr.connect(state => ({
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  })),
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
    const { cutVideoLink, cutPoints, ...passThroughProps }: PropsT = props;
    const parentDivId = "cutVideoDiv";

    const videoCtr = useVideo(parentDivId);
    videoCtr.video = {
      link: cutVideoLink,
      startTimeMs: null,
      endTimeMs: null,
    };

    const editCutPointBvr = useEditCutPoint(cutPoints, videoCtr, cutPoint => {
      props.dispatch(actAddCutPoints([cutPoint]));
    });

    const wrappedComponent = (
      <WrappedComponent
        videoCtr={videoCtr}
        editCutPointBvr={editCutPointBvr}
        {...passThroughProps}
      />
    );

    const videoKeyHandlers = {
      ...createVideoKeyHandlers(videoCtr, props.display),
      "ctrl+shift+insert": () => editCutPointBvr.add("start"),
      "ctrl+shift+alt+insert": () => editCutPointBvr.add("end"),
      "ctrl+shift+l": () => {
        jQuery("#linkPanelInput").focus();
      },
    };
    const videoKeys = Object.keys(videoKeyHandlers);
    const onKeyDown = createKeyDownHandler(videoKeyHandlers);

    return (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        <div id={parentDivId} tabIndex={123}>
          {wrappedComponent}
        </div>
      </KeyboardEventHandler>
    );
  }
);
