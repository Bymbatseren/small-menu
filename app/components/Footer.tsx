export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black py-12 border-t border-gray-200 dark:border-white/10">
            <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} MenuSnap. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
                    <a href="#" className="hover:text-black dark:hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    );
}
