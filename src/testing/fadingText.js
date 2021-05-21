import "./fadingText.css";

export default function FadingtText() {
  //
  return (
    <main>
      <h1>Fading Text</h1>
      <hr></hr>
      <main className="fade-out-text">
        <p
          style={{
            border: "1px solid gainsboro",
            borderRadius: "4px",
            resize: "none",
          }}
        >
          "I must not fear. Fear is the mind-killer. Fear is the little-death
          that brings total obliteration. I will face my fear. I will permit it
          to pass over me and through me. And when it has gone past, I will turn
          the inner eye to see its path. Where the fear has gone there will be
          nothing. Only I will remain."
        </p>
      </main>
    </main>
  );
}
