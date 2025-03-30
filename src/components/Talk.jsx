import React from 'react';

const Talk = () => {

  return (
    <div className="mx-auto rounded-xl p-8 max-w-lg lg:max-w-4xl">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tighter text-pretty text-gray-900 sm:text-5xl">
          Want <span className="text-cyan-600">Realist</span> for your brokerage?
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600">
          We help connect your agents with the most trusted service providers in the industry.
        </p>
      </div>
      <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
        <form className="lg:flex-auto" action="#" method="POST">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                First name
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  name="first-name"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  name="last-name"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  name="email"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm/6 font-semibold text-gray-900">
                Phone
              </label>
              <div className="mt-2.5">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  name="phone"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-cyan-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Let’s talk
            </button>
          </div>
          <p className="mt-4 text-center text-sm/6 text-gray-500">
            By submitting this form, I agree to the{' '}
            <a href="#" className="font-semibold text-cyan-600">
              privacy&nbsp;policy
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Talk;
