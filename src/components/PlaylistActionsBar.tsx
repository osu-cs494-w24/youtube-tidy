import { PlaylistItemObj, SinglePlaylistObj, } from "../assets/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addVideoToPlaylist, removeVideoFromPlaylist } from "../redux/playlistsSlice";
import { addVideoToPlaylistRequest, removeVideoFromPlaylistRequest } from "../requests/PlaylistActions";

const MOVE = 0
const COPY = 1
const REMOVE = 2

export default function PlaylistActionsBar({
    playlist,
    items,
  }: {
    playlist: SinglePlaylistObj;
    items: PlaylistItemObj[];
  }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const handleMoveToPlaylist = async (option: number) => {
        const playlistID = playlist.id;
        const accessToken = user.info?.access_token
        if (accessToken) {
            if (option === MOVE || option === COPY) {
                items.forEach(async item => {
                    const insertVideo = await addVideoToPlaylistRequest(
                        accessToken,
                        playlistID,
                        item.id,
                    );
                    dispatch(addVideoToPlaylist({ playlistID, playlistItem: insertVideo}));
                });
            }
            if (option === MOVE || option === REMOVE) {
                items.forEach(async item => {
                    const removeVideo = await removeVideoFromPlaylistRequest(
                        accessToken,
                        item.id
                    )
                    if (!removeVideo) {
                        dispatch(removeVideoFromPlaylist({ playlistID, videoID: item.contentDetails.videoId}));
                    }
                });
            }
        }
    }
    return (
        <>
            <button type="submit" onClick={() => handleMoveToPlaylist(MOVE)}>Move to...</button>
            <button type="submit" onClick={() => handleMoveToPlaylist(COPY)}>Copy to...</button>
            <button type="submit" onClick={() => handleMoveToPlaylist(REMOVE)}>Remove</button>
        </>
    )
}
