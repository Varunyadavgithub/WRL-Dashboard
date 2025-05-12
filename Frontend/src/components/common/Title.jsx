const Title = ({ title, subTitle, align, font }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:text-left"
      }`}
    >
      <h1 className={`text-4xl md:text-[40px] ${font || "font-playfair"}`}>
        {title}
      </h1>
      {/* <h1
        className={`text-4xl md:text-[40px] ${font || "font-playfair"} 
        relative inline-block`}
      >
        <span
          className="inline-block px-4 py-2 text-white rotate-[-2deg] 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent 
          rounded-md"
        >
          {title}
        </span>
      </h1> */}

      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-172">
        {subTitle}
      </p>
    </div>
  );
};

export default Title;
