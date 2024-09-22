import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {

  const err:any = useRouteError();
  return (
    <section>
      <section className="flex items-center h-full p-16">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="mb-8 font-extrabold text-9xl">
              <span className="sr-only">Error</span>{err.status}
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              {err.data}
            </p>
            <p className="mt-4 mb-8">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <Link
              rel="noopener noreferrer"
              to="/"
              className="px-8 py-3 font-semibold rounded underline"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
};
export default ErrorPage;