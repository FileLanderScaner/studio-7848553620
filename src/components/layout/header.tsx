import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  );
}
