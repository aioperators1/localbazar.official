import { Metadata } from 'next';
import { ConfiguratorClient } from '@/components/store/configurator/ConfiguratorClient';
import { getCategories } from '@/lib/actions/product';

export const metadata: Metadata = {
    title: 'Configurateur PC Gamer sur mesure au Maroc',
    description: 'Montez votre PC Gamer sur mesure avec notre configurateur en ligne.',
};

export default async function ConfigurateurPage() {
    return (
        <div className="bg-[#f3f5f6] min-h-screen pb-20 pt-10 text-zinc-900">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[var(--color-brand-blue)] uppercase tracking-tight">Configurateur Pc Gamer</h1>
                    <p className="text-zinc-500 mt-2 font-medium">Créez le PC de vos rêves composant par composant.</p>
                </div>

                <ConfiguratorClient />
            </div>
        </div>
    );
}
