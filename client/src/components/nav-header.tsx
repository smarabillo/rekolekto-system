import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavHeader({
  mainLogo,
}: {
  mainLogo: {
    name: string;
    logo: { src: string; alt: string };
    plan: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center ">
            <img
              src={mainLogo.logo.src}
              alt={mainLogo.logo.alt}
              className="size-8"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{mainLogo.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {mainLogo.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
