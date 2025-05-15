import React from "react";
import { useParams } from "react-router-dom";

export default function ShowVideo() {
  const { id } = useParams();
  console.log(id);

  return (
    <>
    <div className="border-[5px] border-black">
    <div className="relative h-[80vh] m-2">
        <iframe
   
          src={`https://iframe.mediadelivery.net/embed/409180/${id}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
    </>
  );
}
