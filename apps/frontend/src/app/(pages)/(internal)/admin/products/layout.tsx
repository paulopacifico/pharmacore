import {
  CategoryProvider,
  BrandProvider,
} from "@pharmacore/product-web";
import { InternalShell } from "@/components/internal-shell";

export default function ProductLayout(props: { children: React.ReactNode }) {
  return (
    <InternalShell>
      <CategoryProvider>
        <BrandProvider>{props.children}</BrandProvider>
      </CategoryProvider>
    </InternalShell>
  );
}
