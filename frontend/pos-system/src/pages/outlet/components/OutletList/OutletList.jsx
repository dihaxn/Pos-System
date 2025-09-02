import React from "react";
import OutletCard from "../OutletCard/OutletCard.jsx";
import CardContainer from "../../../shared/components/cardContainer/CardContainer.jsx";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel.jsx";

export default function OutletList({ outlets, loading }) {
    return (
        <div>
            <CardContainer h="77vh" className="overflow-y-auto pr-2">
                {loading ? (
                    <div className="text-center text-gray-600 py-5 text-lg">
                        <LoadingWheel />
                    </div>
                ) : outlets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Outlets Available</h3>
                                <p className="text-gray-500">There are no outlets available at the moment.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {outlets.map((outlet) => (
                            <OutletCard key={outlet.id} outlet={outlet} />
                        ))}
                    </div>
                )}
            </CardContainer>
        </div>
    );
}