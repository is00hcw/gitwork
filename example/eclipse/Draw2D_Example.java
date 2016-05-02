import org.eclipse.draw2d.AbstractLayout;
import org.eclipse.draw2d.Figure;
import org.eclipse.draw2d.GridData;
import org.eclipse.draw2d.GridLayout;
import org.eclipse.draw2d.LightweightSystem;
import org.eclipse.draw2d.XYLayout;
import org.eclipse.draw2d.geometry.Rectangle;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;

public class Draw2D_Example {
	public static void main(String args[]) {

		Shell shell = new Shell();

		LightweightSystem lws = new LightweightSystem(shell);
		Figure parent = new Figure();

//		GridLayout layout = new GridLayout();
		XYLayout layout = new XYLayout();
		
		parent.setLayoutManager(layout);
		lws.setContents(parent);

		createTestFigure(parent, layout);

		shell.setSize(200, 200);
		shell.open();
		shell.setText("Example");
		Display display = Display.getDefault();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch())
				display.sleep();
		}
	}

	private static void createTestFigure(Figure parent, AbstractLayout layout) {
		PlusRoundedRectangle d = new PlusRoundedRectangle();
		parent.add(d,new Rectangle(0,0,40,40));
//		GridData label_gd1 = new GridData();
//		label_gd1.widthHint = 50;
//		label_gd1.heightHint = 50;
//		layout.setConstraint(d, label_gd1);

	}
}
