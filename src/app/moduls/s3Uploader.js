

export const s3Uploader = async (file, setLoading) => {
  try {
    setLoading(true);

    // 1. Request presigned URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-helper`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { url, fileKey } = await response.json();

    // 2. Upload file to S3
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload to S3");
    }

    setLoading(false);

    // 3. Final file URL
    return `https://husnaina195968.s3.eu-central-1.amazonaws.com/${fileKey}`;

  } catch (error) {
    console.error(error);
    setLoading(false);

    return error;
  }
};
