export default function InfoSection() {
  return (
    <section className="bg-cream w-full relative z-20 pb-24 pt-12 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-32 pl-6 lg:pl-[40%]">
        
        {/* Left Block */}
        <div className="flex-1">
          <h2 className="font-display text-4xl md:text-5xl text-dark-brown mb-6">Quality pet food</h2>
          <p className="text-dark-brown/80 font-body text-lg md:text-xl leading-relaxed mb-10 max-w-md">
            High-quality pet food is vital for pets' well-being. It ensures a balanced, nutritious diet for a happy, healthy life.
          </p>
          
          <button className="bg-orange text-white font-display text-xl px-8 py-4 rounded-[16px] shadow-[0_8px_0_rgba(200,80,20,1)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgba(200,80,20,1)] transition-all flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2c-.8 0-1.5.7-1.5 1.5v1.8c-1.3.4-2.2 1.6-2.2 3.1 0 1.7 1.3 3.1 3 3.1h1.4c1.7 0 3.1-1.3 3.1-3.1 0-1.5-.9-2.7-2.2-3.1V3.5C13.5 2.7 12.8 2 12 2zm-5.6 1.8c-1.2 0-2.2 1-2.2 2.2 0 .9.6 1.7 1.5 2.1l1.1-1.1c-.2-.3-.2-.6-.2-1 0-.6.4-1.1 1-1.1h.4L6.9 3.8h-.5zm11.2 0h-.5l-1.1 1.1h.4c.6 0 1 .5 1 1.1 0 .4 0 .7-.2 1l1.1 1.1c.9-.4 1.5-1.2 1.5-2.1 0-1.2-1-2.2-2.2-2.2zm-12.8 5c-1 0-1.8.8-1.8 1.8 0 .8.5 1.4 1.2 1.7l1.1-1.1c-.1-.2-.2-.4-.2-.6 0-.5.4-.9.9-.9h.2l-1.1-1.1h-.3zm14.4 0h-.3l-1.1 1.1h.2c.5 0 .9.4.9.9 0 .2-.1.4-.2.6l1.1 1.1c.7-.3 1.2-.9 1.2-1.7 0-1-.8-1.8-1.8-1.8zM7.5 13.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm9 0c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z"/>
            </svg>
            Go to catalog
          </button>
        </div>

        {/* Right Block */}
        <div className="flex-1">
          <h2 className="font-display text-4xl md:text-5xl text-dark-brown mb-6">with delivery</h2>
          <p className="text-dark-brown/80 font-body text-lg md:text-xl leading-relaxed mb-10 max-w-md">
            Providing high-quality pet food with doorstep delivery for your furry friends' well-being!
          </p>
          
          <a href="#" className="inline-flex items-center gap-3 text-orange font-display text-2xl hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="border-b-4 border-orange/30 pb-1">More about delivery</span>
          </a>
        </div>

      </div>
    </section>
  );
}
