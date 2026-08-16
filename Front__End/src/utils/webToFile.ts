// When the user selects or take a photo, Capacitor gives us a URI/PATH,
// in this format "file:///.../photo.jpg". fetch here can aslo read certain
// local resources/URIs available to the app, and its use here is reading the
// image located in that URI/PATH and gives me its data
export const webPathToFile = async (webPath: string, fileName: string): Promise<File> => {
    const response = await fetch(webPath);
    const blob = await response.blob();

    return new File([blob], fileName, { type: blob.type }); // Create a file out of those parameters
};