import React, { lazy } from "react";
import Link from 'next/link';
import { ReactComponent as IconJournalCheck } from "bootstrap-icons/icons/journal-check.svg";
import { ReactComponent as IconChatRightText } from "bootstrap-icons/icons/chat-right-text.svg";
import { ReactComponent as IconNewspaper } from "bootstrap-icons/icons/newspaper.svg";
import { ReactComponent as IconPersonSquare } from "bootstrap-icons/icons/person-square.svg";
import { ReactComponent as IconReceiptCutoff } from "bootstrap-icons/icons/receipt-cutoff.svg";
import { ReactComponent as IconCalculator } from "bootstrap-icons/icons/calculator.svg";
import { ReactComponent as IconCart3 } from "bootstrap-icons/icons/cart3.svg";

const Search = lazy(() => import("../../components/Search"));

const SupportView: React.FC = () => {
  const renderSupportSection = (icon: React.FC<React.SVGProps<SVGSVGElement>>, title: string, subtitle: string) => (
    <div className="col-md-4">
      <div className="row bg-white p-4 text-center">
        <div className="col-2">
          {icon({ className: "i-va display-5", width: 48, height: 48 })}
        </div>
        <div className="col">
          <h5>{title}</h5>
          <div className="small text-muted">{subtitle}</div>
        </div>
      </div>
    </div>
  );

  const renderAccountLinks = (title: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, links: string[]) => (
    <div className="col-md-3">
      <div className="border pt-3">
        <div className="text-center py-2">
          {icon({ className: "i-va display-6", width: 40, height: 40 })}
          <div className="fw-bold py-2">{title}</div>
        </div>
        <div className="list-group list-group-flush">
          {links.map((linkText, index) => (
            <Link key={index} href="/" className="list-group-item list-group-item-action">
              {linkText}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-dark bg-gradient p-5 text-white text-center">
        <div className="display-5 mb-4">How can we help you today?</div>
        <div className="container px-5">
          <Search />
        </div>
      </div>
      <div className="bg-secondary py-4">
        <div className="container">
          <div className="row gx-5">
            {renderSupportSection(IconJournalCheck, "Knowledge Base", "40 Articles / 12 Categories")}
            {renderSupportSection(IconChatRightText, "Forums", "10 Topics / 7 Posts")}
            {renderSupportSection(IconNewspaper, "News", "15 Posts / 12 Categories")}
          </div>
        </div>
      </div>
      <div className="container pt-3 mb-3">
        <div className="row gx-3">
          {renderAccountLinks("My Account", IconPersonSquare, ["Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"])}
          {renderAccountLinks("Charges & Refunds", IconReceiptCutoff, ["Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"])}
          {renderAccountLinks("Accounting & Taxes", IconCalculator, ["Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"])}
          {renderAccountLinks("Cart", IconCart3, ["Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"])}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
