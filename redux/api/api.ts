import baseApi from '@/lib/api';

export type UploadResponse = {
  provider: any;
  ok: boolean;
  key?: string;
  url?: string;
  message?: string;
};

type UploadArg = {
  file: {
    uri: string;
    name?: string;
    type?: string;
  };
};

function toFormData(arg: UploadArg) {
  const fd = new FormData();
  fd.append('file', {
    uri: arg.file.uri,
    name: arg.file.name || `file_${Date.now()}`,
    type: arg.file.type || 'application/octet-stream',
  } as any);
  return fd;
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<UploadResponse, UploadArg>({
      query: arg => ({
        url: '/upload/image',
        method: 'POST',
        body: toFormData(arg),
        // ⚠️ Content-Type দিবে না, RN নিজে multipart boundary set করবে
      }),
    }),

    uploadVideo: builder.mutation<UploadResponse, UploadArg>({
      query: arg => ({
        url: '/upload/video',
        method: 'POST',
        body: toFormData(arg),
      }),
    }),

    getSignedUrl: builder.query<{ ok: boolean; url: string }, { key: string }>({
      query: ({ key }) => ({
        url: `/upload/signed`,
        method: 'GET',
        params: { key },
      }),
    }),
    //endpoints
  }),
  overrideExisting: true,
});

export const { useUploadImageMutation, useUploadVideoMutation,useGetSignedUrlQuery } = uploadApi;