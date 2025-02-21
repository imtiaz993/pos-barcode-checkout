import FadeLoader from "react-spinners/FadeLoader";

const Loader = () => {
  return (
    <div className="fixed z-[9999999999] inset-0 w-full h-dvh flex justify-center items-center bg-[rgba(0,0,0,0.3)]">
      <FadeLoader
        color={"#FFF"}
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
