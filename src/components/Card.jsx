import { FaStar } from 'react-icons/fa'; // You can use this for the star icons
import Flowerright from './Flowerright';
import { Link } from 'react-router-dom';

const Cards = ({ cardData }) => {

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      {cardData.map((item, index) => (
        <div className="card  w-96 shadow-xl m-2 mt-4" key={index} style={{boxShadow: "#990000 0px 1px 0px 1px ,#990000 1px 0px 1px 1px", backgroundColor:"#111"}}>
          {/* Added margin for spacing */}
          <figure>
            <img className="rounded-[20px] p-3" src={item.src} alt={item.title} />
          </figure>
          <div className="card-body text-start"> {/* Align text to the start (left) */}
            <h2 className="card-title text-white">{item.title}</h2>
            <p className='text-white'>{item.description}</p>
            <div className="card-actions flex justify-between items-center"> {/* Align the button and rating side by side */}
              
              {/* Rating Section */}
              <div className="flex items-center">
                <span className="text-yellow-500 flex">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </span>
                <span className="ml-2 text-white">4.5</span> {/* You can dynamically add the rating */}
              </div>
              
              
              {/* Buy Now Button */}
              <button  style={{border:'none', backgroundColor:"#990000"}} className="btn  text-white all-btn-hover" onClick={() => document.getElementById(`my_modal_${index}`).showModal()}>
               <Link to="/details">Book Now</Link>
              </button>

              {/* Modal */}
              {/* <dialog id={`my_modal_${index}`} className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg text-black">Hello!</h3>
                  <p className="py-4 text-black">Available soon.</p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn bg-red-500 text-white">Close</button>
                    </form>
                  </div>
                </div>
              </dialog> */}
            </div>
          </div>
        </div>
      ))}
    </div>

    </>
  );
}

export default Cards;

  
  