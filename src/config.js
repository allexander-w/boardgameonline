export default {
    ws: "ws://localhost:8002",
    s3BaseUrl(uri) {
        console.log(import.meta.env.VITE_S3, uri)
        return import.meta.env.VITE_S3 + uri;
    }
}