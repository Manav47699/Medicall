export default function PostCard({ post }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "20px",
      borderRadius: "10px"
    }}>
      <h3>{post.user}</h3>
      <img 
        src={`http://127.0.0.1:8000${post.photo}`} 
        alt="uploaded" 
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <p>{post.description}</p>
      <small>Posted at: {new Date(post.created_at).toLocaleString()}</small>
    </div>
  );
}
