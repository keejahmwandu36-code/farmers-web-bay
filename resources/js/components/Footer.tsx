export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <p className="font-medium text-gray-700">🌾 Farmers Interactive Web-Bay</p>
                    <p className="mt-1">
                        Smart monitoring for smallholder fields — built for low-bandwidth environments.
                    </p>
                </div>
                <div className="text-xs">
                    <p>© {new Date().getFullYear()} Farmers Web-Bay</p>
                    <p className="mt-1">Built with Laravel + React</p>
                </div>
            </div>
        </footer>
    );
}