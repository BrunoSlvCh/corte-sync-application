export default function MobileAuthBackground({ image }) {
  return (
    <div className="fixed inset-0 z-0 lg:hidden">
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,14,20,0.5) 0%, rgba(11,14,20,0.85) 55%, rgba(11,14,20,0.97) 100%)",
        }}
      />
    </div>
  );
}
