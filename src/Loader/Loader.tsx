const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
